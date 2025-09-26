import ejs from 'ejs';
import { TemplateData } from '../types';

export const renderTemplate = async ({
  templateContent,
  templateData,
  templateOptions = undefined,
}: {
  templateContent: string;
  templateData: TemplateData;
  templateOptions?: ejs.Options;
}): Promise<string> => {
  try {
    return ejs.render(
      templateContent,
      {
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
        ...templateData,
      },
      templateOptions,
    );
  } catch (error) {
    throw new Error(
      `Failed to render template: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
  }
};
