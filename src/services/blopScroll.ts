/** Only follow a new reply when the visitor has stayed with the current conversation. */
export function isNearConversationEnd(list: Pick<HTMLElement, 'scrollHeight' | 'scrollTop' | 'clientHeight'>) {
  return list.scrollHeight - list.scrollTop - list.clientHeight <= 40;
}

export function scrollToReplyStart(list: HTMLElement, reply: HTMLElement, reducedMotion: boolean) {
  const top = list.scrollTop + reply.getBoundingClientRect().top - list.getBoundingClientRect().top - list.clientTop;
  list.scrollTo({ top: Math.max(0, top), behavior: reducedMotion ? 'auto' : 'smooth' });
}
