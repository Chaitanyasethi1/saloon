import { test, describe } from "node:test";
import assert from "node:assert/strict";

function checkRouteAccess(userRole, pathname) {
  if (
    pathname === "/" ||
    pathname.startsWith("/salon") ||
    pathname.startsWith("/display") ||
    pathname.startsWith("/token") ||
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/forgot-password"
  ) {
    return { allowed: true };
  }

  if (pathname.startsWith("/dashboard/admin")) {
    return { allowed: userRole === "super_admin", redirect: "/login" };
  }

  if (pathname.startsWith("/dashboard/owner")) {
    return {
      allowed: userRole === "salon_owner" || userRole === "super_admin",
      redirect: "/login",
    };
  }

  if (pathname.startsWith("/dashboard/staff")) {
    return {
      allowed:
        userRole === "staff" ||
        userRole === "salon_owner" ||
        userRole === "super_admin",
      redirect: "/login",
    };
  }

  if (pathname.startsWith("/dashboard/customer")) {
    return { allowed: Boolean(userRole), redirect: "/login" };
  }

  return { allowed: true };
}

describe("QueueWise Role Guard & Access Tests", () => {
  test("allows public pages for unauthenticated visitors", () => {
    assert.equal(checkRouteAccess(null, "/").allowed, true);
    assert.equal(checkRouteAccess(null, "/salon/letoile-atelier-mumbai").allowed, true);
    assert.equal(checkRouteAccess(null, "/display/letoile-atelier-mumbai").allowed, true);
    assert.equal(checkRouteAccess(null, "/token/tkn-101").allowed, true);
  });

  test("blocks customer from accessing owner dashboard", () => {
    const check = checkRouteAccess("customer", "/dashboard/owner");
    assert.equal(check.allowed, false);
  });

  test("blocks customer from accessing super admin dashboard", () => {
    const check = checkRouteAccess("customer", "/dashboard/admin");
    assert.equal(check.allowed, false);
  });

  test("blocks staff from accessing super admin and owner dashboard", () => {
    assert.equal(checkRouteAccess("staff", "/dashboard/admin").allowed, false);
    assert.equal(checkRouteAccess("staff", "/dashboard/owner").allowed, false);
    assert.equal(checkRouteAccess("staff", "/dashboard/staff").allowed, true);
  });

  test("allows salon owner to access owner console and staff view", () => {
    assert.equal(checkRouteAccess("salon_owner", "/dashboard/owner").allowed, true);
    assert.equal(checkRouteAccess("salon_owner", "/dashboard/staff").allowed, true);
    assert.equal(checkRouteAccess("salon_owner", "/dashboard/admin").allowed, false);
  });

  test("allows super admin to inspect all consoles", () => {
    assert.equal(checkRouteAccess("super_admin", "/dashboard/admin").allowed, true);
    assert.equal(checkRouteAccess("super_admin", "/dashboard/owner").allowed, true);
    assert.equal(checkRouteAccess("super_admin", "/dashboard/staff").allowed, true);
    assert.equal(checkRouteAccess("super_admin", "/dashboard/customer").allowed, true);
  });
});

