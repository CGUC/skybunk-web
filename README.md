# Skybunk Web

Skybunk on the web for students of Conrad Grebel University College

## Setting up Dev environment
1) Clone the repo - `git clone https://github.com/CGUC/skybunk-web.git`
2) In the cloned folder (`cd skybunk-web`), run `npm install`
3) To start the local server, run `npm run-script dev`, and in your browser go to `localhost:3000'`. And behold, Skybunk Web in all its glory!

## Making / Improving / Playing with features
1) Update your local version of the code - `git fetch origin` and `git pull`
2) Check out a new branch - `git checkout -b [your_name]/[some-cool-branch-name]`
3) Go to town! Changes will update live in your browser so get that alt-Tab ready!

## Steps for Contributing
1) Commit changes you've made along the way on your branch - do this often as you add functionality!
(if you want some help using git on command line, check out [this](https://dont-be-afraid-to-commit.readthedocs.io/en/latest/git/commandlinegit.html) article)
2) Add your feature branch to the remote repo - `git push -u origin [your-branch-name]` (can be done before 1, make sure to `git push` your local changes as you commit them!)
3) Update the code in your branch regularly by doing `git fetch origin`, `git checkout master`, `git pull`, `git checkout [your-branch-name]`, then `git rebase master`. This will make sure anything updated in the main codebase is included in the code you're working on. (Pro tip: You might need to `git push --force` to update your remote branch after this rebasing process)
4) When your feature is complete and tested locally, go to github and make a pull request from your branch into master. If you can, add screenshots of the changes and a brief description of the high-level decisions you made.
5) Help out reviewers as they comb through changes and give their constructive feedback and suggestions to make this the best feature ever
6) When your changes get merged in, boast that you're a software ninja that helped code a social connectivity platform used by hundreds of people :punch:

<i>For a more in-depth walkthrough of the development process, see 'A Contributor's Guide' in the wiki!</i>

---

This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).
