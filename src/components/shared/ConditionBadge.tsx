import { Badge } from "@/components/ui/badge";

const ConditionBadge = ({ condition }: { condition: string }) => {
  return (
    <Badge variant="condition" size="condition">
      {condition}
    </Badge>
  );
};

export default ConditionBadge;
