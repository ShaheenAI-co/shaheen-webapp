
import { useTransform, motion } from 'framer-motion';
import Phrase from './Prase';

export default function Slide({ src, direction, left, progress }) {
  // Convert direction to number (-1 for left, 1 for right)
  const directionMultiplier = direction === 'left' ? -1 : 1;
  
  // Transform scroll progress into horizontal movement
  // As you scroll: left slides go left→right, right slides go right→left
  const translateX = useTransform(
    progress, 
    [0, 1], // Scroll progress from 0% to 100%
    [150 * directionMultiplier, -150 * directionMultiplier] // Movement range
  )

  return (
    <motion.div 
      style={{ x: translateX, left: left }} 
      className="relative flex whitespace-nowrap"
    >
      {/* Repeat the phrase 3 times for continuous effect */}
      <Phrase src={src} />
      <Phrase src={src} />
      <Phrase src={src} />
    </motion.div>
  )
}