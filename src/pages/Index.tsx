import WeeklyScheduler from "@/components/WeeklyScheduler";
import { mockEmployees } from "@/data/mockEmployees";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <WeeklyScheduler employees={mockEmployees} />
    </div>
  );
};

export default Index;