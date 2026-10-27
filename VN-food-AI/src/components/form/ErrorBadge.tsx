import { CircleAlert } from "lucide-react-native";
import { Text } from "react-native";
import { Badge } from "../ui/badge";
import { Icon } from "../ui/icon";

export interface ErrorBadgeProps {
  msg?: string;
}

export default function ErrorBadge({ msg }: ErrorBadgeProps) {
  const lightRed = "#fee2e2";

  return (
    <Badge className="bg-red-100 w-full justify-start mt-2">
      <Icon as={CircleAlert} size={15} fill={"red"} color={lightRed}></Icon>
      <Text className="font-montserrat-medium text-xs text-red-500">{msg}</Text>
    </Badge>
  );
}
