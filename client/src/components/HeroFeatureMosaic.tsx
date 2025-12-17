import { motion } from "framer-motion";
import {
  ShieldCheck,
  ScanFace,
  ClipboardCheck,
  UtensilsCrossed,
  Trash2,
  Eye,
} from "lucide-react";

const features = [
  {
    icon: ShieldCheck,
    title: "Secure Login",
    desc: "Institute authentication with Firebase",
    offset: "translate-y-0",
  },
  {
    icon: ScanFace,
    title: "Face Detection",
    desc: "Student verification at mess entry",
    offset: "-translate-y-6",
  },
  {
    icon: ClipboardCheck,
    title: "Mess Attendance",
    desc: "Automatic attendance marking",
    offset: "translate-y-4",
  },
  {
    icon: UtensilsCrossed,
    title: "Menu Updation",
    desc: "Digital menu management by mess staff",
    offset: "-translate-y-2",
  },
  {
    icon: Eye,
    title: "Transparency",
    desc: "Students & hostel office visibility",
    offset: "translate-y-6",
  },
  {
    icon: Trash2,
    title: "Mess Waste Tracking",
    desc: "Consumption-based waste reduction",
    offset: "translate-y-2",
  },
];

export default function HeroFeatureMosaic() {
  return (
    <div className="relative w-full max-w-lg mx-auto">
      <div className="grid grid-cols-2 gap-6">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            whileHover={{ y: -6, scale: 1.04 }}
            className={`
              group relative
              ${f.offset}
              bg-background/80 backdrop-blur-xl
              border border-[#6770d2]/20
              rounded-2xl p-5
              shadow-[0_15px_40px_rgba(0,0,0,0.15)]
              hover:shadow-[0_30px_80px_rgba(103,112,210,0.35)]
              transition-all
            `}
          >
            {/* Glow */}
            <div className="absolute inset-0 rounded-2xl bg-[#6770d2]/5 opacity-0 group-hover:opacity-100 transition" />

            <div className="relative flex items-start gap-4">
              <div className="
                w-10 h-10 rounded-xl
                bg-[#6770d2]/15
                flex items-center justify-center
                group-hover:scale-110 transition
              ">
                <f.icon size={20} className="text-[#6770d2]" />
              </div>

              <div>
                <h4 className="text-sm font-semibold">{f.title}</h4>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  {f.desc}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
