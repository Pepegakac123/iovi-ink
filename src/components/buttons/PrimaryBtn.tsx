import * as motion from 'motion/react-client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

const PrimaryBtn = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <motion.button 
          className="bg-primary text-background font-primary text-base md:text-lg w-full md:w-fit px-4 md:px-8 py-3 md:py-4 uppercase border-1 border-foreground rounded-md cursor-pointer"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ 
            duration: 0.4,
            ease: "easeOut"
          }}
          whileHover={{ 
            scale: 1.05,
            boxShadow: "4px 4px 0px 0px var(--foreground)",
            transition: { duration: 0.2 }
          }}
          whileTap={{ 
            scale: 0.98,
            transition: { duration: 0.1 }
          }}
        >
          Bezpłatna Konsultacja
        </motion.button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your account
            and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

export default PrimaryBtn