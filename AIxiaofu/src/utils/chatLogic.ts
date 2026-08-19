import { teamInfo, questionPatterns, greetingMessages } from '../data/teamData';

export function generateResponse(userMessage: string): string {
  const lowerMessage = userMessage.toLowerCase();
  
  if (questionPatterns.greeting.some(pattern => pattern.test(lowerMessage))) {
    return greetingMessages[Math.floor(Math.random() * greetingMessages.length)];
  }
  
  if (questionPatterns.thanks.some(pattern => pattern.test(lowerMessage))) {
    return '不客气！很高兴能为您介绍茯忆长安团队~';
  }
  
  if (questionPatterns.teamName.some(pattern => pattern.test(lowerMessage))) {
    return `我们的团队名称是【茯忆长安】，寓意着像茯苓一样温润滋养，承载着长安的文化底蕴~`;
  }
  
  if (questionPatterns.teamIntro.some(pattern => pattern.test(lowerMessage))) {
    return `${teamInfo.description}\n\n我们的使命是：${teamInfo.mission}\n我们的愿景是：${teamInfo.vision}`;
  }
  
  if (questionPatterns.vision.some(pattern => pattern.test(lowerMessage))) {
    return `**愿景**：${teamInfo.vision}\n\n**使命**：${teamInfo.mission}\n\n我们相信，通过技术创新，可以让传统文化在数字时代焕发新生。`;
  }
  
  if (questionPatterns.members.some(pattern => pattern.test(lowerMessage))) {
    let response = '我们团队有四位核心成员：\n\n';
    teamInfo.members.forEach((member, index) => {
      response += `${index + 1}. **${member.name}** - ${member.role}\n`;
      response += `   ${member.bio}\n`;
      response += `   专长：${member.expertise.join('、')}\n\n`;
    });
    return response;
  }
  
  if (questionPatterns.projects.some(pattern => pattern.test(lowerMessage))) {
    let response = '我们有几个代表性的项目：\n\n';
    teamInfo.projects.forEach((project, index) => {
      response += `${index + 1}. **${project.name}**\n`;
      response += `   ${project.description}\n`;
      response += `   标签：${project.tags.join('、')}\n\n`;
    });
    return response;
  }
  
  if (questionPatterns.contact.some(pattern => pattern.test(lowerMessage))) {
    return `您可以通过以下方式联系我们：\n\n**邮箱**：${teamInfo.contact.email}\n**电话**：${teamInfo.contact.phone}\n**官网**：${teamInfo.contact.website}\n**地址**：${teamInfo.contact.location}`;
  }
  
  return `抱歉，我还不太理解您的问题呢~ 您可以问我关于茯忆长安团队的介绍、团队成员、项目案例或者联系方式等问题哦！`;
}

export function formatResponse(text: string): string {
  return text;
}
