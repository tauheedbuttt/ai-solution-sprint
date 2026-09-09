import { useState } from 'react';
import { Fab } from '../../components/fab';
import { CaptureMenu } from '../../components/capturemenu';
import { Sheet } from '../../components/sheet';
import { ScanFlow } from './scanflow';
import { LogFlow } from './logflow';

type flow = 'scan' | 'log' | null;

export function CaptureRoot() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [flow, setFlow] = useState<flow>(null);

  function close() {
    setFlow(null);
  }

  return (
    <>
      <Fab onPress={() => setMenuOpen(true)} />
      <CaptureMenu
        visible={menuOpen}
        onClose={() => setMenuOpen(false)}
        onSelect={(f) => {
          setMenuOpen(false);
          setFlow(f);
        }}
      />
      <Sheet visible={flow === 'scan'} onClose={close}>
        {flow === 'scan' ? <ScanFlow onClose={close} onDone={close} /> : null}
      </Sheet>
      <Sheet visible={flow === 'log'} onClose={close}>
        {flow === 'log' ? <LogFlow onClose={close} onDone={close} /> : null}
      </Sheet>
    </>
  );
}
