module.exports = {
    run: ({ interaction }) => {
      interaction.reply({ content: 'Pong!', ephemeral: true });
    },
  
    data: {
      name: 'ping',
      description: 'Pong!',
    },
  };
  