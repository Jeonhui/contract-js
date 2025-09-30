export type TemplateData = {
  [key: string]: string | number | TemplateData | Array<TemplateData>;
};
