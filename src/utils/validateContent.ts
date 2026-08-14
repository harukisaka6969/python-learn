import type { Chapter } from "../content/types";

const PANDAS_USAGE_PATTERN =
  /import pandas|pd\.|np\.where|DataFrame\(|\w+\[["'][^"'\]]+["']\]|\.(describe|head|tail|shape|dtypes|loc|iloc|astype|fillna|isna|dropna|merge|groupby|agg|pivot_table|melt|sort_values|drop_duplicates|rank|query|isin|between|apply|map|to_csv|to_html|read_csv)\b/;

export interface ValidationIssue {
  message: string;
}

/** カリキュラム全体の整合性チェック: id重複が無いか、cellsが空でないか、
 * usesPandas:trueのセルにpandasの使用が実際に含まれているか。起動時にconsole.errorで通知するために使う。 */
export function validateContent(chapters: Chapter[]): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const seenChapterIds = new Set<string>();
  const seenLessonIds = new Set<string>();

  for (const ch of chapters) {
    if (seenChapterIds.has(ch.id)) issues.push({ message: `章IDが重複しています: ${ch.id}` });
    seenChapterIds.add(ch.id);

    if (ch.lessons.length === 0) issues.push({ message: `章にレッスンがありません: ${ch.id}` });

    for (const lesson of ch.lessons) {
      if (seenLessonIds.has(lesson.id)) issues.push({ message: `レッスンIDが重複しています: ${lesson.id}` });
      seenLessonIds.add(lesson.id);

      if (lesson.cells.length === 0) issues.push({ message: `レッスンに実行サンプルがありません: ${lesson.id}` });

      for (const cell of lesson.cells) {
        // pd./import pandasの直接参照だけでなく、前セルで作ったdf等をそのまま使う
        // 継続セル（.describe()/.loc[]/.groupby()等のDataFrameメソッド呼び出し）も許容する。
        if (cell.usesPandas && !PANDAS_USAGE_PATTERN.test(cell.code)) {
          issues.push({ message: `usesPandas:trueなのにpandasの使用が見当たりません: ${lesson.id}` });
        }
      }
    }
  }

  return issues;
}
