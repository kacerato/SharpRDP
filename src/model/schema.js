import { appSchema, tableSchema } from '@nozbe/watermelondb'

export const mySchema = appSchema({
  version: 1,
  tables: [
    // Tabela para estado do Jogador
    tableSchema({
      name: 'player_state',
      columns: [
        { name: 'sanity', type: 'number' }, // 0 a 100
        { name: 'health', type: 'number' },
        { name: 'stamina', type: 'number' },
        { name: 'current_chapter', type: 'string' },
        { name: 'play_time', type: 'number' },
      ]
    }),
    // Tabela para Itens e Inventário
    tableSchema({
      name: 'items',
      columns: [
        { name: 'item_id', type: 'string' },
        { name: 'name', type: 'string' },
        { name: 'is_equipped', type: 'boolean' },
        { name: 'combinable_with', type: 'string', isOptional: true }, // Ex: Chave + Óleo
      ]
    }),
    // Tabela Crítica: Persistência de Objetos no Mundo (Física)
    tableSchema({
      name: 'world_objects',
      columns: [
        { name: 'object_id', type: 'string' }, // Ex: 'crate_room_101'
        { name: 'position_x', type: 'number' },
        { name: 'position_y', type: 'number' },
        { name: 'position_z', type: 'number' },
        { name: 'rotation_y', type: 'number' },
        { name: 'state', type: 'string' }, // Ex: 'broken', 'open', 'locked'
      ]
    }),
    // Tabela de Decisões (Efeito Borboleta)
    tableSchema({
      name: 'narrative_flags',
      columns: [
        { name: 'flag_key', type: 'string' }, // Ex: 'saw_ghost_mirror'
        { name: 'value', type: 'boolean' },
        { name: 'trigger_time', type: 'number' },
      ]
    }),
  ]
})
