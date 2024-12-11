import Command from "src/core/domain/Command";
import {ExecutionResult} from "src/core/domain/ExecutionResult";
import {useSpacesStore} from "src/spaces/stores/spacesStore";
import {Space} from "src/spaces/models/Space";

export class CreateSpaceCommand implements Command<Space> {

  constructor(
    public newSpaceName: string
  ) {
  }

  async execute(): Promise<ExecutionResult<Space>> {
    try {
      const space: Space = await useSpacesStore().createSpace(this.newSpaceName)
      return Promise.resolve(new ExecutionResult<Space>(space, 'New Space ' + this.newSpaceName + ' created successfully'))
    } catch (err) {
      return Promise.reject(err)
    }
  }
}

CreateSpaceCommand.prototype.toString = function cmdToString() {
  return `CreateSpaceCommand: {name=${this.newSpaceName}}`;
};
