import ejs from 'ejs';

export type TemplateData = {
  [key: string]: string | number;
};

export const renderTemplate = async ({
  templateContent,
  templateData,
}: {
  templateContent: string;
  templateData: TemplateData;
}): Promise<string> => {
  try {
    return ejs.render(templateContent, {
      ...templateData,
      // 유틸리티 함수들
      formatDate: (date: string | Date) => {
        const d = new Date(date);
        return d.toLocaleDateString('ko-KR', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });
      },
      formatCurrency: (amount: number, currency = 'KRW') => {
        return new Intl.NumberFormat('ko-KR', {
          style: 'currency',
          currency,
        }).format(amount);
      },
    });
  } catch (error) {
    throw new Error(
      `Failed to render template: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
  }
};
