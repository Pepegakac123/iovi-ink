import * as motion from 'motion/react-client';

const Subheadline = ({title}: {title: string}) => {
  return (
    <motion.div 
      className="bg-secondary border-1 border-foreground rounded-md px-2 py-2 sm:px-4 lg:py-4 lg:px-8 text-foreground flex align-center justify-center w-fit"
      initial={{ opacity: 0, scale: 0.8, y: -20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ 
        duration: 0.6,
        ease: "easeOut"
      }}
      whileHover={{ 
        scale: 1.05,
        boxShadow: "4px 4px 0px 0px var(--foreground)",
        transition: { duration: 0.2 }
      }}
    >
      <motion.h2 
        className="text-center text-base md:text-xl text-foreground font-primary"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.4 }}
      >
        {title}
      </motion.h2>
    </motion.div>
  )
}
export default Subheadline