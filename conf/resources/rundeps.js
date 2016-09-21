const path = require('path')
const exec = require('child_process').exec;
const fs = require('fs')
const fr = require('find-root')

function execDepBuild(cwd, command) {
    if (
        !fs.existsSync(cwd)
        || !fs.lstatSync(cwd).isDirectory()
    ) {
        throw new Error(`${cwd} is not a directory`)
    }
    console.log('starting ' + command)
    return exec(command, {
        env: process.env,
        cwd: cwd
    }, (error) => {
        if (error !== null) {
            console.error(`exec error: ${error}`);
        }
    })
}

function execProjects(projectsRoot, projects, outdirRoot, createCommand) {
    return projects.map(project => {
        return {
            cwd: projectsRoot,
            project,
            child: execDepBuild(
                path.join(projectsRoot, project),
                createCommand({
                    project: project,
                    outdir: path.join(outdirRoot, project)
                })
            )
        }
    })
}


function main() {
    const root = fr()
    const outdirRoot = path.resolve(root, 'node_modules')
    const projectsRoot = process.env.PROJECTS_ROOT || path.resolve(root, '..')
    const templateString = 'npm run build.dev --$PROJECT_NAME:builddir=$OUTDIR'

    function createCommand(rec) {
        return templateString
            .replace(/\$OUTDIR/g, rec.outdir)
            .replace(/\$PROJECT_NAME/g, rec.project)
    }

    if (process.argv.length <= 2) {
        console.log('Usage: rundeps project1 project2')
        console.log(`Run ${createCommand({outdir: outdirRoot + '/<PROJECT_NAME>'})}`)
        console.log(`For given project in ${projectsRoot} or $PROJECTS_ROOT env`)
        return
    }

    const projects = process.argv.slice(2)
    const childs = execProjects(projectsRoot, projects, outdirRoot, createCommand)
    childs.push({
        cwd: root,
        project: '',
        child: execDepBuild(root, 'npm run start')
    })
    childs.forEach(rec => {
         rec.child.stdout.on('data', data => {
             console.log(`${rec.project}: ${data.replace(/\n$/, '')}`)
         })
         rec.child.stderr.on('data', data => {
             console.error(`${rec.project} [err]: ${data.replace(/\n$/, '')}`)
         })
    })
}

main()
