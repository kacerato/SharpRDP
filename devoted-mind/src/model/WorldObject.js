import { Model } from '@nozbe/watermelondb'
import { field, action } from '@nozbe/watermelondb/decorators'

export default class WorldObject extends Model {
  static table = 'world_objects'

  @field('position_x') x
  @field('position_y') y
  @field('position_z') z
  @field('rotation_y') rotationY
  @field('state') state
  @field('object_id') objectId

  // Ação atômica (thread-safe) para salvar posição após física
  @action async updatePosition(newPosVector, newRotationY) {
    await this.update(object => {
      object.x = newPosVector.x
      object.y = newPosVector.y
      object.z = newPosVector.z
      if (newRotationY !== undefined) {
        object.rotationY = newRotationY
      }
    })
  }
}
