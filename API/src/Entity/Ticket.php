<?php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use JMS\Serializer\Annotation as JMS;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * @ORM\Entity(repositoryClass="App\Repository\TicketsRepository")
 * 
 * @ORM\HasLifecycleCallbacks()
 * @JMS\ExclusionPolicy("ALL")
 */
class Ticket
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     * @JMS\Groups({"whoami", "get_project", "get_tickets"})
     * @JMS\Expose()
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255)
     * 
     * @Assert\NotBlank
     * 
     * @JMS\Groups({"whoami", "get_project", "get_tickets"})
     * @JMS\Expose()
     */
    private $name;

    /**
     * @ORM\Column(type="text", nullable=true)
     * 
     * @Assert\NotBlank
     * @JMS\Groups({"get_tickets"})
     * @JMS\Expose()
     */
    private $description;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Project", inversedBy="tickets")
     * @ORM\JoinColumn(nullable=false)
     */
    private $project;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\User", inversedBy="tickets")
     * @ORM\JoinColumn(nullable=false)
     *
     * @Assert\NotBlank
     * @JMS\Groups({"get_tickets"})
     * @JMS\MaxDepth(1)
     * @JMS\Expose()
     */
    private $user;

    /**
     * @ORM\Column(name="creation_date", type="datetime")
     * @ORM\Column(type="datetime")
     * @JMS\Groups({"get_tickets"})
     * @JMS\Expose()
     */
    private $creationDate;


    /**
     * @ORM\Column(name="modification_date", type="datetime")
     * @ORM\Column(type="datetime")
     * 
     * @JMS\Groups({"get_tickets"})
     * @JMS\Expose()
     */
    private $modificationDate;

    /**
     * @ORM\Column(type="integer")
     * @JMS\Groups({"get_tickets"})
     * @JMS\Expose()
     */
    private $Category;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): self
    {
        $this->name = $name;

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(?string $description): self
    {
        $this->description = $description;

        return $this;
    }

    public function getProject(): ?Project
    {
        return $this->project;
    }

    public function setProject(?Project $project): self
    {
        $this->project = $project;

        return $this;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): self
    {
        $this->user = $user;

        return $this;
    }

    public function getCreationDate(): ?\DateTimeInterface
    {
        return $this->creationDate;
    }

    public function getModificationDate(): ?\DateTimeInterface
    {
        return $this->modificationDate;
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

    public function getCategory(): ?int
    {
        return $this->Category;
    }

    public function setCategory(int $Category): self
    {
        $this->Category = $Category;

        return $this;
    }
}
