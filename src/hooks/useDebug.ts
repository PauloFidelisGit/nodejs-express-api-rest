export default function useDebug({
  label,
  data,
}: {
  label: string;
  data: any;
}) {
  console.log(`========${new Date().toISOString()}========`);
  console.log(`~ ${label}`);
  console.log("========================================");
  console.log(data);
  console.log("\n");
}
