export type GetFormatDateProps = {
  date: string | Date;
  locales?: Intl.LocalesArgument;
  options?: Intl.DateTimeFormatOptions;
};

export const getFormatDate = ({
  date = new Date(),
  locales = 'ko-KR',
  options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  },
}: GetFormatDateProps) => {
  const d = new Date(date);
  return d.toLocaleDateString(locales, options);
};
