import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

export function StatCard({ label, value, icon: Icon, tone }: { label: string; value: string | number; icon: LucideIcon; tone: string }) {
  return (
    <motion.div whileHover={{ y: -4 }} className="glass rounded-xl p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted">{label}</p>
          <p className="mt-2 text-3xl font-bold">{value}</p>
        </div>
        <div className={`rounded-xl p-3 text-white shadow-lg ${tone}`}>
          <Icon size={22} />
        </div>
      </div>
    </motion.div>
  );
}
