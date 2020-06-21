<?php

namespace App\Controller;

use FOS\RestBundle\Controller\Annotations as Rest;
use FOS\RestBundle\Controller\FOSRestController;
use FOS\RestBundle\View\View;
use Nelmio\ApiDocBundle\Annotation as Nelmio;
use Nelmio\ApiDocBundle\Annotation\Model;
use Nelmio\ApiDocBundle\Annotation\Security;
use Swagger\Annotations as SWG;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use App\Entity\User;
use App\Entity\Project;
use App\Entity\Ticket;
use App\Form\TicketType;
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
class TicketController extends FOSRestController
{

    /**
     * @var EntityManager
     */
    private $em;

    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->em = $entityManager;
    }

    /**
     * Create a new ticket in project.
     *
     * This is allowed to any fully authenticated user within project
     *
     * @Rest\Post("/project/{id}/ticket", name="new_ticket")
     * @Rest\View()
     * 
     * @param Project $project
     * 
     */
    public function createTicket(Request $request, Project $project)
    {
        if (!$this->projectContainsUser($this->getUser(), $project)) {
            $view = $this->view(['User' => 'Does not belong to project'], Response::HTTP_BAD_REQUEST);
            return $this->handleView($view);
        }
        $newTicket = new Ticket();
        $project->addTicket($newTicket);
        $newTicket->setProject($project);
        $form = $this->createForm(TicketType::class, $newTicket);
        $form->submit($request->request->all(), false);
        if ($form->isValid()) {
            $newTicket = $form->getData();
            if (!$project->getUsers()->contains($newTicket->getUser())) {
                $view = $this->view(['User' => 'Does not belong to project'], Response::HTTP_BAD_REQUEST);
                return $this->handleView($view);
            }
            $this->em->persist($newTicket);
            $this->em->flush();
            $view = $this->view(['Ticket' => 'Has been add to project'], Response::HTTP_OK);
            return $this->handleView($view);
        }
        $view = $this->view(['Error' => 'One field is missing or invalid argument'], Response::HTTP_BAD_REQUEST);
        return $this->handleView($view);
    }

    /**
     * Delete a ticket from project
     * 
     * This is allowed to any fully authenticated user who created project
     * 
     * @Rest\Delete("/project/{project}/ticket/{ticket}", name="delete_ticket")
     * @Rest\View()
     * @param Project $project
     * @param Ticket $ticket
     */
    public function deleteTicket(Request $request, Project $project, Ticket $ticket)
    {
        if ($project->getCreator() != $this->getUser()) {
            $view = $this->view("User is not project's creator", Response::HTTP_BAD_REQUEST);
            return $this->handleView($view);
        }
        if ($ticket->getProject() != $project) {
            $view = $this->view("Ticket does not belong to this project", Response::HTTP_BAD_REQUEST);
            return $this->handleView($view);
        }
        $project->removeTicket($ticket);
        $em = $this->getDoctrine()->getManager();
        $em->remove($ticket);
        $em->flush();
        $view = $this->view('Ticket deleted', Response::HTTP_OK);
        return $this->handleView($view);
    }

    /**
     * Get all tcket from project.
     * 
     * This is allowed to any fully authenticated user within project
     * 
     * @Rest\Get("/project/{id}/ticket", name="get_tickets")
     * @Rest\View()
     * @param Project $project
     */
    public function getTickets(Request $request, Project $project)
    {
        if (!$project->getUsers()->contains($this->getUser())) {
            $view = $this->view('User does not belong to this project', Response::HTTP_BAD_REQUEST);
            return $this->handleView($view);
        }
        $view = $this->view(['Tickets' => $project->getTickets()], Response::HTTP_OK);
        $context = new Context();
        $context->setGroups(["get_tickets"]);
        $view->setContext($context);
        return $this->handleView($view);
    }

    /**
     * Get a ticket from project.
     * 
     * This is allowed to any fully authenticated user within project
     * 
     * @Rest\Get("/project/{id}/ticket/{ticket}", name="get_ticket")
     * @Rest\View()
     * @param Project $project
     * @param Ticket $ticket
     */
    public function getTicket(Request $request, Project $project, Ticket $ticket)
    {
        if (!$project->getUsers()->contains($this->getUser())) {
            $view = $this->view('User does not belong to this project', Response::HTTP_BAD_REQUEST);
            return $this->handleView($view);
        }
        if (!$project->getTickets()->contains($ticket)) {
            $view = $this->view('Ticket does not belong to this project', Response::HTTP_BAD_REQUEST);
            return $this->handleView($view);
        }
        $view = $this->view(['Ticket' => $ticket], Response::HTTP_OK);
        $context = new Context();
        $context->setGroups(["get_tickets"]);
        $view->setContext($context);
        return $this->handleView($view);
    }

    /**
     * @param User $user
     * @param Project $project
     */
    public function projectContainsUser(User $user, Project $project)
    {
        if ($project->getUsers()->contains($user)) {
            return true;
        }
        return false;
    }
}