// Decision email drafts. The partner edits the draft before it is sent.

export function decisionSubject(startup: string) {
  return `Your Ryse application: ${startup}`;
}

export function decisionDraft(decision: string, founderName: string, startup: string) {
  const first = founderName.trim().split(/\s+/)[0] || "there";
  const open = `Hi ${first},\n\nThank you for pitching ${startup} to the Ryse partners.`;
  const close = "\n\nThe Ryse partners";
  switch (decision) {
    case "accepted":
      return `${open} We were impressed and would like to back you.\n\nWe'll be in touch in the next few days to agree the terms and next steps.${close}`;
    case "waitlisted":
      return `${open} We'd like to keep the conversation going before we decide.\n\nHere is what we'd like to see next: [what would change our mind]${close}`;
    default:
      return `${open} After discussing it, we've decided not to invest at this stage.\n\nOur honest feedback: [feedback]\n\nWe'd be glad to hear from you again as ${startup} grows.${close}`;
  }
}
