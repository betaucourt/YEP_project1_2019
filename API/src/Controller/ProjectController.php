<?php

namespace App\Controller;

use FOS\RestBundle\Controller\Annotations as Rest;
use FOS\RestBundle\Controller\FOSRestController;
use FOS\RestBundle\View\View;
use Nelmio\ApiDocBundle\Annotation as Nelmio;
use Nelmio\ApiDocBundle\Annotation\Model;
use Nelmio\ApiDocBundle\Annotation\Security;
use Swagger\Annotations as SWG;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use App\Entity\User;
use App\Entity\Project;
use App\Form\ProjectType;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;
use FOS\RestBundle\Controller\Annotations\QueryParam;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\EmailType;
use Symfony\Component\Form\Extension\Core\Type\PasswordType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use FOS\RestBundle\Request\ParamFetcher;
use FOS\RestBundle\Controller\Annotations\RequestParam;
use FOS\RestBundle\Controller\Annotations\FileParam;
use Symfony\Component\Validator\Constraints;
use FOS\RestBundle\Request\ParamFetcherInterface;
use FOS\RestBundle\Context\Context;

/**
 * Project controller.
 *
 * @Route("/api")
 */
class ProjectController extends FOSRestController
{
    /**
     * Create a new project.
     *
     * This is allowed to any fully authenticated user
     *
     * @Rest\Post("/project", name="new_project")
     * @Rest\View()
     * 
     */
    public function createProject(Request $request)
    {
        $newProject = new Project();
        $form = $this->createForm(ProjectType::class, $newProject);
        $form->submit($request->request->all());
        if ($form->isValid()) {
            $em = $this->getDoctrine()->getManager();
            $user = $this->getUser();
            $newProject = $form->getData();
            $newProject->setCreator($user);
            $newProject->addUser($user);
            $em->persist($newProject);
            $em->flush();
            $view = $this->view('Project Created', Response::HTTP_CREATED);
            return $this->handleView($view);
        }
        $view = $this->view('Missing argument', Response::HTTP_BAD_REQUEST);
        return $this->handleView($view);
    }

    /**
     * Get a project.
     * 
     * This is allowed to any fully authenticated user within project
     * 
     * @Rest\Get("/project/{id}", name="get_project")
     * @Rest\View()
     * @param Project $project
     */
    public function getProject(Request $request, Project $project)
    {
        if (!$project->getUsers()->contains($this->getUser())) {
            $view = $this->view('User does not belong to this project', Response::HTTP_BAD_REQUEST);
            
            
            return $this->handleView($view);
        }
        $view = $this->view($project, Response::HTTP_OK);
        $context = new Context();
        $context->setGroups(["get_project"]);
        $view->setContext($context);
        return $this->handleView($view);
    }

    /**
     * Modify a project name/description
     * 
     * This is allowed to fully authenticated User who created project
     * 
     * @Rest\Put("/project/{id}", name="modify_project")
     * @Rest\View()
     * 
     * @Rest\RequestParam(
     *      name="name",
     *      nullable=true,
     * )
     * @Rest\RequestParam(
     *      name="description",
     *      nullable=true,
     * )
     * 
     * @param Request $request
     * @param Project $project 
     * @param ParamFetcherInterface $paramFetcher
     */
    public function modifyProject(Request $request, Project $project, ParamFetcherInterface $paramFetcher)
    {
        $em = $this->getDoctrine()->getManager();
        $name = $paramFetcher->get('name');
        $description = $paramFetcher->get('description');
        if ($name != null && strlen($name) >= 3) {
            $project->setName($name);
            $first = "updated";
        } else if ($name == null || strlen($name) < 3) {
            $first = "not updated";
        }
        if ($description != null && strlen($description) >= 3) {
            $project->setDescription($description);
            $second = "updated";
        } else if ($description == null || strlen($description)) {
            $second = "not updated";
        }
        $em->flush();
        $view = $this->view(['name' => $first, 'description' => $second], Response::HTTP_OK);
        return $this->handleView($view);
    }

    /**
     * Delete a project
     * 
     * This is allowed to fully authenticated user who created project
     * 
     * @Rest\Delete("/project/{project}", name="delete_project")
     * @Rest\View()
     * @param Request $request
     * @param Project $project
     */
    public function deleteProject(Request $request, Project $project)
    {
        if ($project->getCreator() != $this->getUser()) {
            $view = $this->view("user is not project's creator");
            return $this->handleView($view);
        }
        $em = $this->getDoctrine()->getManager();
        $em->remove($project);
        $em->flush();
        $view = $this->view("Project has been deleted");
        return $this->handleView($view);
    }
}