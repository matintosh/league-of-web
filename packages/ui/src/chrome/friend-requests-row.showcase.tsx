import type { ShowcaseEntry } from "../showcase";
import { FriendRequestsRow } from "./friend-requests-row";
import { FriendRequestsRowClickableDemo } from "./friend-requests-row.demo";

export const friendRequestsRowShowcase: ShowcaseEntry = {
  slug: "friend-requests-row",
  name: "FriendRequestsRow",
  area: "chrome",
  description:
    '"Friend Requests" sidebar row — gold-2 label left, solid gold-4 count badge right. Renders as a button when onClick is provided, div otherwise.',
  variants: [
    {
      name: "Single request (count=1)",
      notes: "Badge width is tight at single digit — px-1 keeps it compact.",
      render: () => (
        <div className="w-64 bg-blue-7">
          <FriendRequestsRow count={1} />
        </div>
      ),
    },
    {
      name: "Multiple requests (count=12)",
      notes:
        "Badge grows horizontally with two digits — verifies px-1 padding scales correctly.",
      render: () => (
        <div className="w-64 bg-blue-7">
          <FriendRequestsRow count={12} />
        </div>
      ),
    },
    {
      name: "Clickable (onClick provided)",
      notes:
        "Row renders as a <button>; click to trigger console.log. Hover shows bg-grey-cool.",
      render: () => <FriendRequestsRowClickableDemo />,
    },
  ],
};
