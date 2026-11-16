export const buildInviteMessage = (house) =>
  `Join "${house.name}" on Roomies Hub to split expenses with me.\n\n` +
  `Invite code: ${house.inviteCode}\n\n` +
  `Open ${window.location.origin}, tap Join house, and enter this code.`;

export const shareOnWhatsApp = (house) => {
  const text = encodeURIComponent(buildInviteMessage(house));
  window.open(`https://wa.me/?text=${text}`, "_blank", "noopener,noreferrer");
};

export const shareInvite = async (house) => {
  const text = buildInviteMessage(house);
  if (navigator.share) {
    try {
      await navigator.share({ title: "Roomies Hub", text });
      return;
    } catch {
      return; // user cancelled
    }
  }
  window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
};