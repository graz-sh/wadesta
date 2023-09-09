interface MakeDtsSourceArgs {
  import: string;
  type: string;
}

export const makeDtsSource = ({ import: $import, type }: MakeDtsSourceArgs) => {
  const importLine = `import { ${type} } from "${$import}";`;
  const varLine = `const data: ${type};`;
  const exportLine = `export default data;`;

  return `${importLine}\n${varLine}\n${exportLine}\n`;
};
