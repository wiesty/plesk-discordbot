const { MessageEmbed, ApplicationCommandOptionType } = require("discord.js");
const axios = require("axios");
const { timeout } = require("nodemon/lib/config");

const PLESKAPIKEY = process.env.PLESK_APIKEY;
const PLESK_URL = process.env.PLESK_URL;
const MAIL_ALIAS = process.env.MAIL_ALIAS;

module.exports = {
  run: async ({ interaction }) => {
    const aliasName = interaction.options.getString("aliasname");

    if (!aliasName) {
      return interaction.reply({
        content: "Bitte gib einen Aliasnamen an.",
        ephemeral: true,
      });
    }

    try {
      const response = await axios.post(
        `https://${PLESK_URL}:8443/api/v2/cli/mail/call`,
        {
          params: ["--update", MAIL_ALIAS, "-aliases", `del:${aliasName}`],
        },
        {
          headers: { 
            'accept': 'application/json', 
            'Content-Type': 'application/json', 
            'x-api-key': PLESKAPIKEY,
          },
          family: 4, //Define ipv4 or ipv6
        }
      );
      const embed = createEmbed(response);
      interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error("Fehler beim Hinzufügen des Alias:", error);
      interaction.reply({
        content: "Es ist ein Fehler beim Hinzufügen des Alias aufgetreten.",
        ephemeral: true,
      });
    }
  },

  data: {
    name: "removealias",
    description: "Löscht einen Alias",
    options: [
      {
        name: "aliasname",
        description: "Der Name des Alias, der hinzugefügt werden soll",
        type: ApplicationCommandOptionType.String,
        required: true,
      },
    ],
  },
};



function createEmbed(response) {
  const embed = {
    color: 0x99060e,
    title: `Antwort vom Plesk-Server`,
    fields: [
      { name: "Response", value: response.data.stdout},
    ],
  };

  return embed;
}
