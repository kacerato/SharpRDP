import { createMachine, assign } from 'xstate';

export const elaraMachine = createMachine({
  id: 'elara',
  initial: 'idle',
  context: {
    sanity: 100,
    stamina: 100,
    health: 100,
    equippedItem: null,
    isHurt: false, // Derived from health < 50, but kept for explicit logic
  },
  states: {
    idle: {
      on: {
        MOVE: { target: 'walking' },
        CROUCH: { target: 'crouching' },
        INTERACT: { target: 'interacting' }, // Só pode interagir se estiver parada
        HEAR_NOISE: { target: 'alert' },
        TERRIFY: { target: 'terrified' },
        HALLUCINATE: { target: 'hallucinating' }
      }
    },
    walking: {
      on: {
        STOP: { target: 'idle' },
        RUN: { target: 'running', cond: (ctx) => ctx.stamina > 0 }, // Guarda (Condition)
        TERRIFY: { target: 'terrified' }, // Evento de susto
        HALLUCINATE: { target: 'hallucinating' }
      }
    },
    running: {
      invoke: {
        src: 'drainStaminaService' // Serviço que drena stamina enquanto corre
      },
      on: {
        STOP: { target: 'idle' },
        STAMINA_DEPLETED: { target: 'walking' },
        TERRIFY: { target: 'terrified' }
      }
    },
    crouching: {
      on: {
        STAND_UP: { target: 'idle' },
        MOVE: { target: 'crouch_walking' }
      }
    },
    crouch_walking: {
      on: {
        STOP: { target: 'crouching' },
        STAND_UP: { target: 'walking' }
      }
    },
    interacting: {
      // Estado Bloqueante: Não pode andar livremente enquanto empurra ou examina
      on: {
        FINISH_INTERACTION: { target: 'idle' }
      }
    },
    // Estado Psicológico (Paralelo ou Hierárquico)
    hallucinating: {
      entry: 'triggerVisualDistortion', // Ativa o Shader de distorção
      exit: 'clearVisualDistortion',
      on: {
        TAKE_MEDS: { target: 'idle', actions: 'restoreSanity' },
        WAIT_IT_OUT: { target: 'idle' } // Temporary recovery
      }
    },
    terrified: {
       // Forced state where Elara is scared (e.g., looking back while running)
       on: {
           CALM_DOWN: { target: 'idle' },
           RUN: { target: 'running' } // Can run while terrified, but animation is different
       }
    },
    alert: {
        on: {
            RELAX: { target: 'idle' },
            INVESTIGATE: { target: 'walking' }
        }
    }
  }
}, {
    services: {
        drainStaminaService: (context) => (callback) => {
            const interval = setInterval(() => {
                callback('DRAIN_STAMINA');
            }, 100);
            return () => clearInterval(interval);
        }
    },
    actions: {
        restoreSanity: assign({ sanity: (ctx) => Math.min(ctx.sanity + 20, 100) }),
        triggerVisualDistortion: () => console.log('Visual distortion triggered'),
        clearVisualDistortion: () => console.log('Visual distortion cleared')
    }
});
