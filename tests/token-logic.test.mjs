import { test, describe } from "node:test";
import assert from "node:assert/strict";

// Helper function replicates wait time formula
function calculateEstimatedWait(tokensAheadCount, avgDurationMins = 30, activeChairsCount = 4) {
  if (tokensAheadCount <= 0) return 0;
  const chairs = Math.max(1, activeChairsCount);
  return Math.ceil((tokensAheadCount * avgDurationMins) / chairs);
}

// Sequential token number generator logic
function getNextTokenNo(existingDayTokens) {
  if (!existingDayTokens || existingDayTokens.length === 0) return 1;
  return Math.max(...existingDayTokens.map((t) => t.tokenNo)) + 1;
}

// Validation helper for double booking
function canBookToken(existingTokens, customerId, salonId) {
  const activeStatuses = ["booked", "checked_in", "in_service"];
  const hasActive = existingTokens.some(
    (t) =>
      t.customerId === customerId &&
      t.salonId === salonId &&
      activeStatuses.includes(t.status)
  );
  return !hasActive;
}

// Status transition validator
function isValidStatusTransition(currentStatus, newStatus) {
  const allowed = {
    booked: ["checked_in", "cancelled", "skipped", "no_show"],
    checked_in: ["in_service", "skipped", "cancelled", "no_show"],
    in_service: ["completed"],
    completed: [],
    cancelled: [],
    no_show: [],
    skipped: ["checked_in", "in_service", "cancelled"],
  };
  return allowed[currentStatus]?.includes(newStatus) || false;
}

// Cancellation policy checker (30 min grace period)
function canCancelToken(slotStartTime, currentTime, graceMinutes = 30) {
  const [slotH, slotM] = slotStartTime.split(":").map(Number);
  const [currH, currM] = currentTime.split(":").map(Number);
  const slotMinutes = slotH * 60 + slotM;
  const currentMinutes = currH * 60 + currM;
  return slotMinutes - currentMinutes >= graceMinutes;
}

describe("QueueWise Token Engine Tests", () => {
  test("generates sequential token #1 for first booking of the day", () => {
    const nextNo = getNextTokenNo([]);
    assert.equal(nextNo, 1);
  });

  test("generates sequential token #15 when 14 tokens exist", () => {
    const mockTokens = [{ tokenNo: 12 }, { tokenNo: 14 }, { tokenNo: 8 }];
    const nextNo = getNextTokenNo(mockTokens);
    assert.equal(nextNo, 15);
  });

  test("calculates estimated wait time accurately across chairs", () => {
    // 4 tokens ahead, avg 30m each, across 4 chairs -> ceil((4 * 30) / 4) = 30m
    const wait = calculateEstimatedWait(4, 30, 4);
    assert.equal(wait, 30);

    // 3 tokens ahead, avg 45m, across 2 chairs -> ceil((3 * 45) / 2) = 68m
    const wait2 = calculateEstimatedWait(3, 45, 2);
    assert.equal(wait2, 68);

    // 0 tokens ahead -> 0m
    const waitZero = calculateEstimatedWait(0, 30, 4);
    assert.equal(waitZero, 0);
  });

  test("prevents double booking when customer holds an active token at same salon", () => {
    const existingTokens = [
      { id: "t1", customerId: "cust-1", salonId: "salon-1", status: "booked" },
      { id: "t2", customerId: "cust-2", salonId: "salon-1", status: "completed" },
    ];

    // cust-1 cannot book another active token at salon-1
    assert.equal(canBookToken(existingTokens, "cust-1", "salon-1"), false);

    // cust-2 whose token is completed CAN book again
    assert.equal(canBookToken(existingTokens, "cust-2", "salon-1"), true);

    // cust-3 (new) can book
    assert.equal(canBookToken(existingTokens, "cust-3", "salon-1"), true);
  });

  test("validates token lifecycle status transitions", () => {
    assert.equal(isValidStatusTransition("booked", "checked_in"), true);
    assert.equal(isValidStatusTransition("checked_in", "in_service"), true);
    assert.equal(isValidStatusTransition("in_service", "completed"), true);
    assert.equal(isValidStatusTransition("completed", "booked"), false); // cannot revert
    assert.equal(isValidStatusTransition("cancelled", "in_service"), false);
  });

  test("enforces cancellation policy based on grace period", () => {
    // Slot is at 15:00, current time is 14:00 (60 mins ahead) -> Can cancel
    assert.equal(canCancelToken("15:00", "14:00", 30), true);

    // Slot is at 15:00, current time is 14:45 (only 15 mins ahead) -> Cannot cancel
    assert.equal(canCancelToken("15:00", "14:45", 30), false);
  });
});
