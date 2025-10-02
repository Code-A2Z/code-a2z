<h3>:zap: Add Your Project as a Submodule 🚀</h3>

> We want your work to be readable by others; therefore, we encourage you to note the following:

<p align="center">
  <img src="https://raw.githubusercontent.com/Code-A2Z/assets/main/blog-script-submodule-addition.gif" alt="https://github.com/Code-A2Z/assets/blob/main/blog-script-submodule-addition.gif" width="700" />
</p>

1. Project/Repository names should be in `kebab-case` letters (e.g., `to-do-list`, `joke-telling-application`).

   > Ensure your repository contains the following files:
   1. _README.md_ → Briefly explain the project, its features, and use cases.
   2. _SETUP.md_ → Step-by-step guide to setting up the project locally.
   3. _LICENSE_ → Define the licensing terms for project usage.
   4. _SCREENSHOT_ → Add an image showcasing the project’s UI, if available.
   5. _WORKING PROTOTYPE_ → (Optional) Provide a live demo link or preview GIF/video.
   6. _DEPLOYED URL_ → Attach a deployed URL in your project repository.

2. Run the following command to add your project as a submodule:

   > Run this command from the root directory `/workspaces/<this-project-name>`

```bash
git submodule add --depth 1 <your_project_repo_url> projects/<category>/<project_name>
```

> Example for a web development project:
>
> ```bash
> git submodule add --depth 1 https://github.com/your-username/my-web-project.git projects/web-development/my-web-project
> ```

3. Create a new branch.

```bash
git checkout -b <add/project_name>
```

4. Stage the changes

```bash
git add .
```

5. Commit and Push changes

   > Commit message should be clear. Never write un-necessary things in the commit messages.

```bash
git commit -m "Add <project_name> as a submodule under <category>"
git push -u origin <add/project_name>
```

6. Create a Pull Request
   1. Go to your forked repository on GitHub.
   2. Click on Compare & pull request.
   3. Provide a clear description of your project.
   4. Submit the PR for review.
