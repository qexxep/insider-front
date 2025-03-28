import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';

/**
 * 주어진 날짜를 '~전' 형식으로 변환
 * @param date - 날짜 문자열 또는 Date 객체
 * @returns '방금 전', '3일 전' 등의 상대적 시간 문자열
 *
 * @example formatTimeAgo()
 */
export const formatTimeAgo = (date: string | Date) => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const distance = formatDistanceToNow(dateObj, { addSuffix: true, locale: ko });
  return distance === '1분 미만 전' ? '방금 전' : distance;
};
