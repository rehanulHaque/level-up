export function generateTitleAndLevel(exp: number) {
    // Set the max level and exp needed for max level
    const maxLevel = 100;
    const expForMaxLevel = 100000; // Example value for max level exp
    const fancyTitles = [
      "Novice Explorer",
      "Apprentice of the Stars",
      "Guardian of Realms",
      "Knight of the Twilight",
      "Sage of the Infinite",
      "Master of Dimensions",
      "Warden of Eternity",
      "Champion of the Ancients",
      "Avatar of Legends",
      "Titan of the Cosmos"
    ];
  
    // Calculate the level (scaling the exp)
    let level = Math.floor((exp / expForMaxLevel) * maxLevel);
    
    // Ensure level is between 1 and maxLevel
    if (level < 1) level = 1;
    if (level > maxLevel) level = maxLevel;
  
    // Determine title based on the level
    let titleIndex = Math.floor(level / (maxLevel / fancyTitles.length));
    let title = fancyTitles[titleIndex >= fancyTitles.length ? fancyTitles.length - 1 : titleIndex];
  
    return { level, title };
  }
  
  