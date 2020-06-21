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
use App\Form\UserType;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;

use FOS\RestBundle\Request\ParamFetcherInterface;
use FOS\RestBundle\Context\Context;

use FOS\RestBundle\Request\ParamFetcher;
use FOS\RestBundle\Controller\Annotations\RequestParam;
use FOS\RestBundle\Controller\Annotations\FileParam;
use Symfony\Component\Validator\Constraints;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\EmailType;
use Symfony\Component\Form\Extension\Core\Type\PasswordType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
/**
 * User controller.
 *
 * @Route("/api")
 */
class UserController extends FOSRestController
{
    /**
     * Create a new user.
     *
     * This is allowed to all
     *
     * @Rest\Post("/user", name="new_user")
     * @Rest\View()
     */
    public function newUser(Request $request)
    {
        $em = $this->getDoctrine()->getManager();
    
        $newUser = new User();
        $form = $this->createForm(UserType::class, $newUser);
        $form->submit($request->request->all());

        if ($form->isValid()) {
            $newUser = $form->getData();
            $newUser->setPlainPassword($form->get('password')->getData());
            $em = $this->getDoctrine()->getManager();
            $test = $em->getRepository(User::class)->findOneBy(['email' => $newUser->getEmail()]);
            if ($test == null) {
                $em->persist($newUser);
                $em->flush();
                $view = $this->view(['User Created', $newUser], Response::HTTP_OK);
                return $this->handleView($view);
            }
            $view = $this->view('User already exist', Response::HTTP_BAD_REQUEST);
            return $this->handleView($view);
        }

        $view = $this->view('Missing argument', Response::HTTP_BAD_REQUEST);
        return $this->handleView($view);
    }

    /**
     * Returns information about who is the user.
     *
     * This is allowed to any fully authenticated user
     *
     * @Rest\Get("/user", name="get_user")
     * @Rest\View()
     * @SWG\Response(
     *     response=200,
     *     description="Returns the currently connected user"
     * )
     * 
     * @Nelmio\Security(name="Bearer")
     */
    public function getUsers(Request $request)
    {
        $user = $this->getUser();
        if (null !== $user) {
            $view = View::create($user, Response::HTTP_OK);
            $serializationContext = $view->getContext();
            $serializationContext->addGroup("whoami");

            return $this->handleView($view);
        }
        else {
            return View::create([
                "message" => "Forbidden"
            ], Response::HTTP_FORBIDDEN);
        }
    }

    /**
     * Modify user
     * This is allowed to any fully authenticated user
     * 
     * @Rest\RequestParam(
     *      name="name",
     *      nullable=true,
     * )
     * @Rest\RequestParam(
     *      name="email",
     *      nullable=true,
     * )
     * @Rest\RequestParam(
     *      name="password",
     *      nullable=true,
     * )
     * @Rest\RequestParam(
     *      name="favorite",
     *      nullable=true,
     * )
     * @Rest\Put("/user", name="modify_user")
     * @Rest\View()
     */
    public function modifyUser(request $request, ParamFetcherInterface $paramFetcher)
    {
        $em = $this->getDoctrine()->getManager();
        $user = $em->getRepository(User::class)->find($this->getUser()->getId());
        $name = $paramFetcher->get('name');
        if (!$name || $name == "") {
            $nameMsg = "Didn't change";
        } else {
            $user->setUserName($name);
            $nameMsg = "changed";
        }
        $email = $paramFetcher->get('email');
        if (!$email || $email == "") {
            $emailMsg = "Didn't change";
        } else {
            $user->setEmail($email);
            $emailMsg = "changed";
        }
        $password = $paramFetcher->get('password');
        if (!$password || $password == "") {
            $passMsg = "Didnt change";
        } else {
            $user->setPlainPassword($password);
            $passMsg = "changed";
        }
        $favorite = $paramFetcher->get('favorite');
        if (!$favorite || $favorite == "" ) {
            $favMsg = "Didn't change";
        } else {
            $favorites = [];
            $tmp = strtok($favorite, ',');
            while ($tmp !== false) {
                $favorites[] = $tmp;
                $tmp = strtok(',');
            }
            $user->setFavorite($favorites);
            $favMsg = "changed";
        }
        $em->flush();
        $view = $this->view(['Name' => $nameMsg, 'Email' => $emailMsg, 'Password' => $passMsg, 
        'Favorite' => $favMsg], Response::HTTP_OK);
        return $this->handleView($view);
    }

    /**
     * Get user's project
     * This is allowed to any fully authenticated user
     * 
     * @Rest\Get("/user/project", name="user_project")
     * @Rest\View()
     */
    public function getUserProject(Request $request)
    {
        $em = $this->getDoctrine()->getManager();
        $projects = $this->getUser()->getProjects();//$em->getRepository(Project::class)->findBy(['users' => $this->getUser()->getId()]);
        
        $view = $this->view(['Projects' => $projects], Response::HTTP_OK);
        return $this->handleView($view);
    }

}