import { BeatLoader } from "react-spinners";
import Spinner from "../../ui/common/spinner";
import DashboardSkeleton from "../../ui/skeletons";

export default function Loading() {
  // You can add any UI inside Loading, including a Skeleton.
  return <DashboardSkeleton />
}