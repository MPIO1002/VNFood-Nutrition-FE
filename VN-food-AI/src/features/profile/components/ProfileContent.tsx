import { ProfileResponse } from "@/api/generated/model";
import {
  useCalculateNutritionMutation,
  useUpdateWeightMutation,
} from "../hooks/profile.queries";
import { ProfileFormSchema } from "../validation/profileSchema";
import {
  Activity,
  Lock,
  Minus,
  Plus,
  Ruler,
  Scale,
  Target,
  UserRound,
  Unlock,
} from "lucide-react-native";
import { useMemo, useState, type ReactNode } from "react";
import { ActivityIndicator, Alert, Image, Pressable, Text, View } from "react-native";

const colors = {
  ink: "#18181B",
  muted: "#71717A",
  lavender: "#F5F0F6",
  green: "#059669",
  blue: "#475569",
  orange: "#D97706",
  rose: "#E11D48",
};

function formatNumber(value: number | null | undefined, digits = 0) {
  return value == null ? "--" : value.toFixed(digits);
}

function bmiLabel(bmi: number | null) {
  if (bmi == null) return "Chưa đủ dữ liệu";
  if (bmi < 18.5) return "Thiếu cân";
  if (bmi < 23) return "Bình thường";
  if (bmi < 25) return "Thừa cân";
  return "Béo phì";
}

function goalLabel(goal: string | null) {
  switch (goal) {
    case "gain_weight":
      return "Tăng cân";
    case "lose_weight":
      return "Giảm cân";
    case "maintain_weight":
      return "Giữ dáng";
    default:
      return "Theo dõi sức khỏe";
  }
}

function ProfileCard({ children }: { children: ReactNode }) {
  return (
    <View
      className="mb-4 rounded-[24px] border border-border-subtle bg-canvas-white p-4"
      style={{
        elevation: 2,
        shadowColor: colors.ink,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      }}>
      {children}
    </View>
  );
}

function SectionTitle({ Icon, title }: { Icon: typeof Activity; title: string }) {
  return (
    <View className="mb-4 flex-row items-center gap-3">
      <Icon size={19} color={colors.ink} strokeWidth={2} />
      <Text className="font-montserrat-semibold text-base text-charcoal-pure">{title}</Text>
    </View>
  );
}

function MetricCard({
  Icon,
  label,
  value,
  unit,
  detail,
}: {
  Icon: typeof Activity;
  label: string;
  value: string;
  unit: string;
  detail: string;
}) {
  return (
    <View className="flex-1 rounded-xl p-3" style={{ backgroundColor: colors.lavender }}>
      <View className="mb-1 flex-row items-center gap-1.5">
        <Icon size={13} color={colors.muted} />
        <Text className="font-montserrat text-xs text-zinc-500">{label}</Text>
      </View>
      <Text className="mt-1 font-montserrat-medium text-lg text-charcoal-pure">
        {value} <Text className="text-sm">{unit}</Text>
      </Text>
      <Text className="font-montserrat text-[11px] text-zinc-500">{detail}</Text>
    </View>
  );
}

function EditableMetric({
  label,
  value,
  unit,
  onChange,
}: {
  label: string;
  value: number | null;
  unit: string;
  onChange: (delta: number) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  return (
    <ProfileCard>
      <View className="flex-row items-center justify-between">
        <SectionTitle Icon={label === "Cân nặng hiện tại" ? Scale : Ruler} title={label} />
        <Pressable
          accessibilityLabel={isEditing ? `Lưu ${label.toLowerCase()}` : `Mở khóa ${label.toLowerCase()}`}
          className="mb-4 h-9 w-9 items-center justify-center rounded-full bg-zinc-100"
          onPress={() => {
            if (isEditing) {
              setIsEditing(false);
            } else {
              setIsEditing(true);
            }
          }}>
          {isEditing ? <Unlock size={16} color={colors.green} /> : <Lock size={16} color={colors.muted} />}
        </Pressable>
      </View>
      <View className="flex-row items-center justify-between rounded-xl p-3" style={{ backgroundColor: colors.lavender }}>
        <Pressable accessibilityLabel={`Giảm ${label.toLowerCase()}`} disabled={!isEditing} className="h-11 w-11 items-center justify-center rounded-xl bg-white" style={{ opacity: isEditing ? 1 : 0.45 }} onPress={() => onChange(-0.1)}>
          <Minus size={16} color={colors.ink} />
        </Pressable>
        <Text className="font-montserrat text-3xl text-charcoal-pure">
          {formatNumber(value, 1)}<Text className="text-base text-zinc-600"> {unit}</Text>
        </Text>
        <Pressable accessibilityLabel={`Tăng ${label.toLowerCase()}`} disabled={!isEditing} className="h-11 w-11 items-center justify-center rounded-xl bg-white" style={{ opacity: isEditing ? 1 : 0.45 }} onPress={() => onChange(0.1)}>
          <Plus size={16} color={colors.ink} />
        </Pressable>
      </View>
      <View className="mt-2 flex-row items-center justify-center gap-2 rounded-xl bg-zinc-100 py-2.5">
        {isEditing ? <Unlock size={13} color={colors.green} /> : <Lock size={13} color={colors.muted} />}
        <Text className="font-montserrat-medium text-xs text-charcoal-pure">
          {isEditing ? "Bấm khóa để lưu" : "Đang khóa chỉnh sửa"}
        </Text>
      </View>
    </ProfileCard>
  );
}

const GOALS = [
  { value: "lose_weight", label: "Giảm cân" },
  { value: "maintain_weight", label: "Giữ dáng" },
  { value: "gain_weight", label: "Tăng cân" },
] as const;

function EditableGoal({
  value,
  onChange,
}: {
  value: string | null;
  onChange: (value: string) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  return (
    <ProfileCard>
      <View className="flex-row items-center justify-between">
        <SectionTitle Icon={Target} title="Mục tiêu vóc dáng" />
        <Pressable
          accessibilityLabel={isEditing ? "Khóa mục tiêu vóc dáng" : "Mở khóa mục tiêu vóc dáng"}
          className="mb-4 h-9 w-9 items-center justify-center rounded-full bg-zinc-100"
          onPress={() => setIsEditing((current) => !current)}>
          {isEditing ? <Unlock size={16} color={colors.green} /> : <Lock size={16} color={colors.muted} />}
        </Pressable>
      </View>
      <View className="rounded-xl p-3" style={{ backgroundColor: colors.lavender }}>
        <Text className="font-montserrat text-xs text-zinc-500">Mục tiêu hiện tại</Text>
        <Text className="mt-1 font-montserrat-medium text-lg text-charcoal-pure">{goalLabel(value)}</Text>
        {isEditing && (
          <View className="mt-3 flex-row gap-2">
            {GOALS.map((goal) => (
              <Pressable
                key={goal.value}
                className="flex-1 rounded-xl border px-2 py-2.5"
                style={{
                  borderColor: value === goal.value ? colors.green : "#E4E4E7",
                  backgroundColor: value === goal.value ? "#ECFDF5" : "#FFFFFF",
                }}
                onPress={() => onChange(goal.value)}>
                <Text className="text-center font-montserrat-medium text-[11px] text-charcoal-pure">
                  {goal.label}
                </Text>
              </Pressable>
            ))}
          </View>
        )}
      </View>
      <View className="mt-2 flex-row items-center justify-center gap-2 rounded-xl bg-zinc-100 py-2.5">
        {isEditing ? <Unlock size={13} color={colors.green} /> : <Lock size={13} color={colors.muted} />}
        <Text className="font-montserrat-medium text-xs text-charcoal-pure">
          {isEditing ? "Khóa để giữ lựa chọn" : "Đang khóa chỉnh sửa"}
        </Text>
      </View>
    </ProfileCard>
  );
}

export function ProfileContent({ profile }: { profile: ProfileResponse }) {
  const updateWeight = useUpdateWeightMutation();
  const calculateNutrition = useCalculateNutritionMutation();
  const [weight, setWeight] = useState(profile.weight);
  const [height, setHeight] = useState(profile.height);
  const [goal, setGoal] = useState(profile.goal);
  const [savedValues, setSavedValues] = useState({
    weight: profile.weight,
    height: profile.height,
    goal: profile.goal,
    bmi: profile.bmi,
    tdee: profile.tdee,
    targetCalories: profile.target_calories,
  });
  const bmi = useMemo(() => {
    return savedValues.bmi;
  }, [savedValues.bmi]);
  const targetCalories = savedValues.targetCalories ?? 0;
  const changeWeight = (delta: number) => setWeight((current) => Math.max(0.1, Number(((current ?? 0) + delta).toFixed(1))));
  const saveChanges = async () => {
    const result = ProfileFormSchema.safeParse({ weight, height: height ?? 0 });
    if (!result.success) {
      Alert.alert("Dữ liệu chưa hợp lệ", result.error.issues[0]?.message);
      return;
    }
    if (!profile.age || !profile.sex_for_equation || !profile.activity_level || !goal) {
      Alert.alert("Thiếu dữ liệu", "Chưa đủ thông tin để tính lại chỉ số.");
      return;
    }
    try {
      await updateWeight.mutateAsync({ data: { weight_kg: result.data.weight } });
      const nutrition = await calculateNutrition.mutateAsync({
        data: {
          age: profile.age,
          height_cm: result.data.height,
          weight_kg: result.data.weight,
          sex_for_equation: profile.sex_for_equation as "male" | "female",
          activity_level: profile.activity_level as "sedentary" | "light" | "moderate" | "active" | "very_active",
          goal: goal as "gain_weight" | "lose_weight" | "maintain_weight",
        },
      });
      setSavedValues({
        weight: result.data.weight,
        height: result.data.height,
        goal,
        bmi: nutrition.bmi,
        tdee: nutrition.estimated_tdee_kcal_per_day,
        targetCalories: nutrition.target_kcal_per_day,
      });
      Alert.alert("Đã lưu", "Các chỉ số đã được cập nhật.");
    } catch {
      Alert.alert("Không thể lưu", "Vui lòng thử lại sau.");
    }
  };

  return (
    <>
      <ProfileCard>
        <View className="items-center">
          {profile.avatar_url ? <Image source={{ uri: profile.avatar_url }} className="h-24 w-24 rounded-full" /> : (
            <View className="h-24 w-24 items-center justify-center rounded-full bg-zinc-300"><UserRound size={36} color={colors.muted} /></View>
          )}
          <Text className="mt-3 font-montserrat-medium text-base text-charcoal-pure">{profile.full_name || "Người dùng CaloViet"}</Text>
          <Text className="mt-1 font-montserrat text-xs text-zinc-500">
            {profile.email} · {profile.age ?? "--"} tuổi · Tham gia từ {new Date(profile.created_at).toLocaleDateString("vi-VN")}
          </Text>
          <View className="mt-3 rounded-full px-3 py-1.5" style={{ backgroundColor: "#FAF2FA" }}>
            <Text className="font-montserrat-medium text-xs" style={{ color: colors.green }}>
              ● Mục tiêu: {goalLabel(profile.goal)} {targetCalories ? `(${targetCalories} kcal)` : ""}
            </Text>
          </View>
        </View>
      </ProfileCard>

      <ProfileCard>
        <SectionTitle Icon={Activity} title="Thể trạng & Chỉ số chuyển hóa" />
        <View className="rounded-xl p-3" style={{ backgroundColor: colors.lavender }}>
          <Text className="font-montserrat-medium text-xs text-zinc-500">CHỈ SỐ KHỐI CƠ THỂ (BMI)</Text>
          <View className="mt-1 flex-row items-end justify-between">
            <Text className="font-montserrat text-3xl text-charcoal-pure">{formatNumber(bmi, 1)}</Text>
            <Text className="mb-1 font-montserrat-medium text-xs" style={{ color: colors.green }}>{bmiLabel(bmi)}</Text>
          </View>
          <View className="mt-4 h-2 flex-row overflow-hidden rounded-full"><View className="flex-1 bg-blue-300" /><View className="flex-1 bg-emerald-500" /><View className="flex-1 bg-amber-400" /><View className="flex-1 bg-rose-600" /></View>
          <View className="mt-1 flex-row justify-between"><Text className="font-montserrat text-[9px] text-zinc-500">Thiếu cân</Text><Text className="font-montserrat text-[9px] text-zinc-500">Chuẩn</Text><Text className="font-montserrat text-[9px] text-zinc-500">Thừa cân</Text><Text className="font-montserrat text-[9px] text-zinc-500">Béo phì</Text></View>
        </View>
        <View className="mt-3 flex-row gap-3">
          <MetricCard Icon={Activity} label="TDEE ước tính" value={formatNumber(profile.tdee, 0)} unit="kcal" detail="Năng lượng tiêu hao/ngày" />
          <MetricCard Icon={Target} label="Mục tiêu mỗi ngày" value={formatNumber(targetCalories, 0)} unit="kcal" detail="Theo mục tiêu hiện tại" />
        </View>
      </ProfileCard>

      <EditableMetric label="Cân nặng hiện tại" value={weight} unit="kg" onChange={changeWeight} />
      <EditableMetric label="Chiều cao hiện tại" value={height} unit="cm" onChange={(delta) => setHeight((current) => Math.max(1, Number(((current ?? 0) + delta).toFixed(1))))} />
      <EditableGoal value={goal} onChange={setGoal} />

      <ProfileCard>
        <SectionTitle Icon={Target} title="Mục tiêu dinh dưỡng hàng ngày" />
        <View className="rounded-xl p-3" style={{ backgroundColor: colors.lavender }}>
          <Text className="font-montserrat text-xs text-zinc-500">Phân bổ calo khuyến nghị</Text>
          <Text className="mt-1 font-montserrat text-2xl text-charcoal-pure">{formatNumber(targetCalories, 0)} <Text className="text-sm">kcal / ngày</Text></Text>
        </View>
        <View className="mt-4 flex-row gap-2">
          {[["Carbs", "45%", colors.orange, "#FFF7E6"], ["Đạm", "30%", colors.blue, "#F1F5F9"], ["Chất béo", "25%", colors.rose, "#FFF1F2"]].map(([label, percent, color, backgroundColor]) => (
            <View key={label} className="flex-1 rounded-2xl border border-white p-3" style={{ backgroundColor }}>
              <Text className="font-montserrat-medium text-xs" style={{ color }}>{label}</Text><Text className="mt-1 font-montserrat-semibold text-sm text-charcoal-pure">{percent}</Text>
            </View>
          ))}
        </View>
      </ProfileCard>
      <Pressable className="mb-2 items-center rounded-xl bg-charcoal-pure py-4"       disabled={updateWeight.isPending || calculateNutrition.isPending} onPress={saveChanges}>
        {updateWeight.isPending ? <ActivityIndicator color="#FFF" /> : <Text className="font-montserrat-semibold text-sm text-white">Lưu tất cả thay đổi</Text>}
      </Pressable>
      <Text className="mb-5 text-center font-montserrat text-[11px] text-zinc-500">Dữ liệu được mã hóa y tế và đồng bộ tức thời</Text>
    </>
  );
}
