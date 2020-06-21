<?php
namespace App\Repository;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\EntityRepository;
use Doctrine\ORM\Mapping\ClassMetadata;
use Symfony\Component\HttpFoundation\Session\Session;

class UserRepository extends EntityRepository
{
    private $em;
    private $meta;
    private $session;

    public function __construct(EntityManagerInterface $em, ClassMetadata $meta) {
        parent::__construct($em, $meta);

        $this->em = $em;
        $this->meta = $meta;
        $this->session = new Session();
    }
}