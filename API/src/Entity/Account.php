<?php

namespace App\Entity;


use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\Collection;
use Doctrine\Common\Collections\ArrayCollection;
use FOS\UserBundle\Model\User as BaseUser;

use App\Validator\Constraints as AppAssert;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use JMS\Serializer\Annotation as JMS;

/**
 * @ORM\Entity(repositoryClass="App\Repository\AccountRepository")
 */
class Account extends BaseUser
{
    /**
     * @ORM\Id
     * @ORM\Column(type="integer")
     * @ORM\GeneratedValue(strategy="IDENTITY")
     *
     * @JMS\Groups({"whoami", "getUsers", "getUser"})
     * @JMS\Expose()
     */
    protected $id;

    /**
     * @ORM\Column(name="creation_date", type="datetime")
     *
     * @JMS\Groups({"fillable", "whoami", "getUsers", "getUser"})
     * @JMS\SerializedName("creationDate")
     * @JMS\Expose()
     */
    private $creationDate;

    /**
     * @ORM\Column(name="modification_date", type="datetime")
     *
     * @JMS\Groups({"fillable", "whoami", "getUsers", "getUser"})
     * @JMS\SerializedName("modificationDate")
     * @JMS\Expose()
     */
    private $modificationDate;

    /**
     * Plain password. Used for model validation. Must not be persisted.
     *
     * @JMS\Groups({"fillable", "whoami"})
     *
     */
    protected $plainPassword;


    public function __construct() {
        parent::__construct();
    }

    /**
     * Get id
     *
     * @return int
     */
    public function getId(): ?int
    {
        return $this->id;
    }

    public function getCreationDate()
    {
      return $this->creationDate;
    }

    public function getModificationDate()
    {
      return $this->modificationDate;
    }

    /**
     * Set id
     *
     * @param \int $id
     *
     * @return \Base
     */
    public function setId($id)
    {
        $this->id = $id;

        return $this;
    }

    public function setCreationDate($creationDate)
    {
        $this->creationDate = $creationDate;

        return $this;
    }

    public function setModificationDate($modificationDate)
    {
        $this->modificationDate = $modificationDate;

        return $this;
    }

    /** @ORM\PrePersist */
    public function prePersist()
    {
        $this->setCreationDate(new \DateTime("now"))
             ->setModificationDate(new \DateTime("now"));
    }

    /** @ORM\PreUpdate */
    public function preUpdate()
    {
        $this->setModificationDate(new \DateTime("now"));
    }
}
