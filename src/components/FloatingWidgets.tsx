import { useState } from 'react';
import { FloatingActions } from './FloatingActions';
import { AiTutor } from './edtech/AiTutor';

/** Плавающие кнопки: AI сверху, WhatsApp снизу */
export function FloatingWidgets() {
  const [aiOpen, setAiOpen] = useState(false);

  return (
    <>
      <FloatingActions onAiClick={() => setAiOpen(true)} />
      <AiTutor open={aiOpen} onOpenChange={setAiOpen} hideFab />
    </>
  );
}
