import { Model } from '@nozbe/watermelondb'
import { field, action } from '@nozbe/watermelondb/decorators'

export default class PlayerState extends Model {
  static table = 'player_state'

  @field('sanity') sanity
  @field('health') health
  @field('stamina') stamina
  @field('current_chapter') currentChapter
  @field('play_time') playTime

  @action async setHealth(newHealth) {
    await this.update(state => {
      state.health = newHealth
    })
  }

  @action async setSanity(newSanity) {
    await this.update(state => {
      state.sanity = newSanity
    })
  }
}
