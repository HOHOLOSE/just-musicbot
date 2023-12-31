const {
  CommandInteraction,
  PermissionFlagsBits,
  ApplicationCommandType,
} = require("discord.js");
const JUGNU = require("../../../handlers/Client");
const { Queue } = require("distube");
const { swap_pages } = require("../../../handlers/functions");

module.exports = {
  name: "queue",
  description: `ดูคิวปัจจุบันด้วยเลขหน้า`,
  userPermissions: PermissionFlagsBits.Connect,
  botPermissions: PermissionFlagsBits.Connect,
  category: "Music",
  cooldown: 5,
  type: ApplicationCommandType.ChatInput,
  inVoiceChannel: true,
  inSameVoiceChannel: true,
  Player: true,
  djOnly: true,

  /**
   *
   * @param {JUGNU} client
   * @param {CommandInteraction} interaction
   * @param {String[]} args
   * @param {Queue} queue
   */
  run: async (client, interaction, args, queue) => {
    // Code
    if (!queue.songs.length) {
      return client.embed(
        interaction,
        `${client.config.emoji.ERROR} ไม่มีอะไรในคิว`
      );
    } else {
      let embeds = await client.getQueueEmbeds(queue);
      await swap_pages(interaction, embeds);
    }
  },
};
