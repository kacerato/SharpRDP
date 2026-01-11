import { createMachine, assign } from 'xstate';

export const elaraMachine = createMachine({
  id: 'elara',
  initial: 'idle',
  context: {
    sanity: 100,
    stamina: 100,
    health: 100,
    equippedItem: null,
    isHurt: false,
  },
  states: {
    idle: {
      on: {
        MOVE: { target: 'walking' },
        CROUCH: { target: 'crouching' },
        INTERACT: { target: 'interacting' },
        HEAR_NOISE: { target: 'alert' },
        TERRIFY: { target: 'terrified' },
        HALLUCINATE: { target: 'hallucinating' },
        HIDE: { target: 'hiding' },
        TAKE_DAMAGE: { target: 'idle', actions: 'reduceHealth' } // Transition to self to trigger action
      }
    },
    walking: {
      on: {
        STOP: { target: 'idle' },
        RUN: { target: 'running', cond: (ctx) => ctx.stamina > 0 },
        TERRIFY: { target: 'terrified' },
        HALLUCINATE: { target: 'hallucinating' },
        HIDE: { target: 'hiding' },
        TAKE_DAMAGE: { target: 'walking', actions: 'reduceHealth' }
      }
    },
    running: {
      invoke: {
        src: 'drainStaminaService'
      },
      on: {
        STOP: { target: 'idle' },
        STAMINA_DEPLETED: { target: 'walking' },
        TERRIFY: { target: 'terrified' },
        HIDE: { target: 'hiding' },
        TAKE_DAMAGE: { target: 'running', actions: 'reduceHealth' }
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
      on: {
        FINISH_INTERACTION: { target: 'idle' },
        TAKE_DAMAGE: { target: 'idle', actions: 'reduceHealth' } // Force exit interaction if hit
      }
    },
    hiding: {
       on: {
           EXIT_HIDE: { target: 'idle' }
       }
    },
    hallucinating: {
      entry: 'triggerVisualDistortion',
      exit: 'clearVisualDistortion',
      on: {
        TAKE_MEDS: { target: 'idle', actions: 'restoreSanity' },
        WAIT_IT_OUT: { target: 'idle' }
      }
    },
    terrified: {
       on: {
           CALM_DOWN: { target: 'idle' },
           RUN: { target: 'running' }
       }
    },
    alert: {
        on: {
            RELAX: { target: 'idle' },
            INVESTIGATE: { target: 'walking' }
        }
    },
    dying: {
        type: 'final'
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
        reduceHealth: assign({
            health: (ctx) => Math.max(ctx.health - 20, 0),
            isHurt: (ctx) => (ctx.health - 20) < 50
        }),
        triggerVisualDistortion: () => console.log('Visual distortion triggered'),
        clearVisualDistortion: () => console.log('Visual distortion cleared')
    }
});
