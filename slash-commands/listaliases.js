const { MessageEmbed, ApplicationCommandOptionType } = require("discord.js");
const axios = require("axios");

const PLESKAPIKEY = process.env.PLESK_APIKEY;
const PLESK_URL = process.env.PLESK_URL;
const MAIL_ALIAS = process.env.MAIL_ALIAS;

module.exports = {
  run: async ({ interaction }) => {

    try {
      const response = await axios.post(
        `https://${PLESK_URL}:8443/api/v2/cli/mail/call`,
        {
            params: ["--info", MAIL_ALIAS],
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
      const aliases = extractAliases(response.data.stdout);
      const embed = createEmbed(aliases);
      interaction.reply({ embeds: [embed] });
    } catch (error) {
        console.error("Fehler beim Abrufen der Aliasinformationen:", error);
        interaction.reply({
          content: "Es ist ein Fehler beim Abrufen der Aliasinformationen aufgetreten.",
          ephemeral: true,
        });
    }
  },

  data: {
    name: "listaliases",
    description: "Listet alle aliases",
  },
};

function extractAliases(stdout) {
    const startIndex = stdout.indexOf("Alias(es):") + 11;
    const endIndex = stdout.indexOf("\nMailbox:");
    const aliasesString = stdout.substring(startIndex, endIndex);
    const aliasesArray = aliasesString.split(", ");
    return aliasesArray;
  }


function createEmbed(aliases) {
  const embed = {
    color: 0x99060e,
    title: `Antwort vom Plesk-Server`,
    description: aliases.join(", "),
  };

  return embed;
}
