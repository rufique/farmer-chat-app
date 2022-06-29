export const reformatChatTopic = (topic) => {
    const usernames = topic.split(',');
    return [...new Set(usernames)]
      .sort((a, b) => (a < b ? -1 : 1))
      .join(',');
}

export const getInititals = (fullname) => {
    let names = fullname.split(' ');
    let initials = names[0][0] + ' ' + names[1][0];
    return initials.toUpperCase();
}