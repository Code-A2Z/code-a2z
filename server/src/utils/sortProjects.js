/**
 * Sorts an array of project objects by their 'createdAt' date in descending order (newest first).
 * 
 * @param {Array<Object>} projects - Array of project objects to be sorted
 * @param {Date|string} projects[].createdAt - The creation date of the project
 * @returns {Array<Object>} A new array of projects sorted by createdAt date (newest first)
 * 
 * @example
 * const projects = [
 *   { name: 'Project A', createdAt: new Date('2024-01-15') },
 *   { name: 'Project B', createdAt: new Date('2024-03-20') },
 *   { name: 'Project C', createdAt: new Date('2024-02-10') }
 * ];
 * const sorted = sortProjects(projects);
 * // Returns: [Project B, Project C, Project A]
 */
const sortProjects = (projects) => {
  if (!Array.isArray(projects)) {
    throw new TypeError('Expected an array of projects');
  }

  return [...projects].sort((a, b) => {
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);
    
    // Sort in descending order (newest first)
    return dateB - dateA;
  });
};

module.exports = sortProjects;
