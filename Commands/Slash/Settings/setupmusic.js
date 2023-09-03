const {
  CommandInteraction,
  ChannelType,
  PermissionFlagsBits,
  ApplicationCommandType,
} = require("discord.js");
const JUGNU = require("../../../handlers/Client");
const { Queue } = require("distube");

module.exports = {
  name: "setupmusic",
  description: `ตั้งค่าช่องเพลงในเซิร์ฟเวอร์`,
  userPermissions: PermissionFlagsBits.ManageChannels,
  botPermissions: PermissionFlagsBits.ManageChannels,
  category: "Settings",
  cooldown: 5,
  type: ApplicationCommandType.ChatInput,
  inVoiceChannel: false,
  inSameVoiceChannel: false,
  Player: false,
  djOnly: false,

  /**
   *
   * @param {JUGNU} client
   * @param {CommandInteraction} interaction
   * @param {String[]} args
   * @param {Queue} queue
   */
  run: async (client, interaction, args, queue) => {
    // Code
    let channel = await client.music.get(
      `${interaction.guild.id}.music.channel`
    );
    let oldChannel = interaction.guild.channels.cache.get(channel);
    if (oldChannel) {
      return client.embed(
        interaction,
        `** ${client.config.emoji.ERROR} Music Request Channel ติดตั้งเรียบร้อยแล้ว ${oldChannel} ลบก่อนและติดตั้งอีกครั้ง **`
      );
    } else {
      interaction.guild.channels
        .create({
          name: `${client.user.username}-requests`,
          type: ChannelType.GuildText,
          rateLimitPerUser: 3,
          reason: `for music bot`,
          topic: `ช่องขอเพลงสำหรับ ${client.user.username}, พิมพ์ชื่อเพลงหรือลิงค์เพื่อเล่นเพลง`,
        })
        .then(async (ch) => {
          await ch
            .send({ embeds: [client.queueembed(interaction.guild)] })
            .then(async (queuemsg) => {
              await ch
                .send({
                  embeds: [client.playembed(interaction.guild)],
                  components: [client.buttons(true)],
                })
                .then(async (playmsg) => {
                  await client.music.set(`${interaction.guild.id}.music`, {
                    channel: ch.id,
                    pmsg: playmsg.id,
                    qmsg: queuemsg.id,
                  });
                  client.embed(
                    interaction,
                    `${client.config.emoji.SUCCESS} ติดตั้งระบบเพลงสำเร็จใน ${ch}`
                  );
                });
            });
        });
    }
  },
};
