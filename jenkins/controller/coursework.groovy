import hudson.plugins.git.BranchSpec
import hudson.plugins.git.GitSCM
import hudson.plugins.git.UserRemoteConfig
import jenkins.model.Jenkins
import org.jenkinsci.plugins.workflow.cps.CpsScmFlowDefinition
import org.jenkinsci.plugins.workflow.job.WorkflowJob

def jenkins = Jenkins.get()
def name = 'WorkSphere-Deployment'
if (jenkins.getItem(name) == null) {
    def repository = 'https://github.com/Khiemnh158/worksphere-deployment.git'
    def branch = System.getenv('DEPLOYMENT_BRANCH') ?: 'main'
    def scm = new GitSCM(
        [new UserRemoteConfig(repository, null, null, null)],
        [new BranchSpec("*/${branch}")],
        false, [], null, null, []
    )
    def job = jenkins.createProject(WorkflowJob, name)
    job.definition = new CpsScmFlowDefinition(scm, 'jenkins/Jenkinsfile')
    job.definition.lightweight = true
    job.save()
}
