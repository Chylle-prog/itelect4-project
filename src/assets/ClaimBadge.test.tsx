import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ClaimBadge from "./ClaimBadge";
import type { Claim } from "../types/index";

const approvedClaim: Claim = {
  id: "665f1c2ab4e8d3a1f0c9e101",
  itemId: "item-101",
  claimantUserId: "user-202",
  notes: "Found blue hydro flask near the library bench",
  status: "approved",
  createdAt: new Date("2026-10-17T02:15:00.000Z"),
};

describe("ClaimBadge", () => {
  it("shows the claim status and evidence for an approved claim", () => {
    render(<ClaimBadge claim={approvedClaim} itemName="Hydro Flask" />);

    expect(screen.getByText("approved")).toBeInTheDocument();
    expect(screen.getByText("Item: Hydro Flask")).toBeInTheDocument();
    expect(
      screen.getByText("Evidence: Found blue hydro flask near the library bench"),
    ).toBeInTheDocument();
  });

  it("says No claim loaded yet when claim is null", () => {
    render(<ClaimBadge claim={null} />);

    expect(screen.getByText("No claim loaded yet.")).toBeInTheDocument();
  });
});
