# Skybunk Web

Skybunk on the web for students of Conrad Grebel University College

## Setting up Dev environment
1) Make sure you have [git installed](https://www.linode.com/docs/development/version-control/how-to-install-git-on-linux-mac-and-windows/) (GIT IT!)
    - If on windows we suggest using git bash (which should be installed alongside git) instead of a GUI - but ultimately use whatever you find works best for you
2) Fork the repo (this will make a copy in your personal github account - [a guide to forking](https://guides.github.com/activities/forking/))
3) Clone the forked repo - `git clone https://github.com/{Your_Github_Username}/skybunk-web`
4) In the cloned folder (`cd skybunk-web`), run `npm install`
5) To start the local server, run `npm run-script dev`, and in your browser go to `localhost:3000`. And behold, Skybunk Web in all its glory!
6) <i>Note that by default, this web app will be asking for resources (data) from the actual production API - `api.grebelife.com`. If you want to mess around with data (adding/editing/deleting posts, pictures, etc), consider pointing the requests to a local server, by editing the `API_ADDRESS` in `src/config.js` - i.e. `API_ADDRESS="http://localhost:3000"`. See the [server README](https://github.com/CGUC/skybunk-server/blob/master/README.md#setting-up-the-dev-environment) for help getting your local server running.</i>

## Making / Improving / Playing with features
1) Check out a new branch - `git checkout -b [some-cool-and-descriptive-branch-name]`
2) Go to town! Changes will update live in your browser so get that alt-Tab ready!

## Staying up-to-date with the CGUC repository
<p>So far we've forked all of the code from 'CGUC/skybunk-web' to our own github account (the fork), then pulled that code down to our computers ('git clone'). Perhaps you've even made a new branch and started playing around with the code!</p>
<p>Now here's a scenario: what if, right after we forked and cloned, someone else pushed a massive update to the original 'CGUC/skybunk-web' repo?? The code we have on our computer would be out of date, and if we built new stuff on top of it then tried to merge it back in with the original (and now updated!) repo we'd likely have a confused mess.</p>
<p>What's the solution, you ask? <i>Syncing</i>. By regularly 'syncing' our local copy of all the code with the original remote, we make sure we're always working on top of the latest changes and don't run into trouble down the line.</p>

<b>Simple Steps to Syncing (on command line)</b>
<br /><i>*If you're not using command-line, following along with this logic will still give you a good idea of what you need to do!*</i>

1) From inside your cloned folder, view the 'remotes' that git is currently aware of for this project.
`git remote -v`. Expect to see something like `origin https://github.com/{Your_Github_Username}/skybunk-web.git` for 'fetch' and 'push'. This is, of course, the fork you made earlier!
2) Add the original repository as a remote, calling it something like 'upstream'. This tells git where the code we wanted to stay synced with is! `git remote add upstream https://github.com/CGUC/skybunk-web.git`
3) Make sure this worked by again running `git remote -v`.
4) Whenever you want to update your local code, run;
    - `git fetch upstream`
    - `git checkout master`
    - `git pull upstream/master` (your local master is now up-to-date with the original repo!)
    - `git push origin/master` (update the forked repo on your github account)
5) If you're working on a feature branch, try to merge in the latest updates on master by doing `git checkout [branch-name]` then `git merge master`. If all goes well, you'll be fully up-to-date and can return your focus to coding!

## Steps for Contributing
1) Add your feature branch to your remote fork - `git push -u origin [your-branch-name]`
2) Commit changes you've made along the way on your branch, and `git push` them to your remote fork - do this often as you add functionality!
(if you want some help using git on command line, check out [this](https://dont-be-afraid-to-commit.readthedocs.io/en/latest/git/commandlinegit.html) article)
3) Remeber to sync your code with `CGUC/skybunk-web` regularly!
4) When your feature is complete and tested locally, go to your forked repo on github and make a pull request into CGUC/skybunk-web. If you can, add screenshots of the changes and a brief description of the high-level decisions you made.
5) Help out reviewers as they comb through changes and give their constructive feedback and suggestions to make this the best feature ever
6) When your changes get merged in, boast that you're a software ninja that helped code a social connectivity platform used by hundreds of people :punch:

<i>For a more in-depth walkthrough of the development process, see 'A Contributor's Guide' in the wiki!</i>

---

This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).
