"use client";

import { FriendRequestsRow } from "./friend-requests-row";

/** Clickable variant — row renders as a <button> and logs clicks. */
export function FriendRequestsRowClickableDemo() {
  return (
    <div className="w-64 bg-blue-7">
      <FriendRequestsRow
        count={2}
        onClick={() => console.log("Friend Requests clicked")}
      />
    </div>
  );
}
